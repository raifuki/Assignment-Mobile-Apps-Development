export interface SourceFile {
  path: string;
  name: string;
  language: string;
  description: string;
  code: string;
}

export const KOTLIN_SOURCE_FILES: SourceFile[] = [
  {
    path: "app/src/main/java/com/kotlin/quiz/model/Question.kt",
    name: "Question.kt",
    language: "kotlin",
    description: "Lớp biểu diễn dữ liệu (Data Class) lưu trữ thông tin của một câu hỏi, bao gồm tệp đáp án và giải thích ngắn.",
    code: `package com.kotlin.quiz.model

import java.io.Serializable

/**
 * Data class representing a quiz question.
 * Implements Serializable to easily pass data between Activities if needed.
 */
data class Question(
    val id: Int,
    val text: String,
    val options: List<String>,
    val correctIndex: Int,
    val explanation: String
) : Serializable
`
  },
  {
    path: "app/src/main/java/com/kotlin/quiz/viewmodel/QuizViewModel.kt",
    name: "QuizViewModel.kt",
    language: "kotlin",
    description: "Thành phần cốt lõi của MVVM, nắm giữ dữ liệu game (tiến trình, điểm số, thời gian) bền vững qua vòng đời xoay màn hình.",
    code: `package com.kotlin.quiz.viewmodel

import android.os.CountDownTimer
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.kotlin.quiz.model.Question

class QuizViewModel : ViewModel() {

    // Danh sách câu hỏi của chủ đề hiện tại
    private val _questions = MutableLiveData<List<Question>>()
    val questions: LiveData<List<Question>> get() = _questions

    // Chỉ số câu hỏi hiện tại (0 -> N-1)
    private val _currentQuestionIndex = MutableLiveData<Int>(0)
    val currentQuestionIndex: LiveData<Int> get() = _currentQuestionIndex

    // Điểm số hiện tại (số câu trả lời đúng)
    private val _score = MutableLiveData<Int>(0)
    val score: LiveData<Int> get() = _score

    // Trạng thái đếm ngược thời gian (giây còn lại)
    private val _timeLeft = MutableLiveData<Int>(30)
    val timeLeft: LiveData<Int> get() = _timeLeft

    // Trạng thái hoàn thành bài thi
    private val _isFinished = MutableLiveData<Boolean>(false)
    val isFinished: LiveData<Boolean> get() = _isFinished

    // Lưu lại danh sách các đáp án mà người dùng đã chọn để hiển thị review sau khi xong
    private val _userChoices = MutableLiveData<MutableMap<Int, Int>>(mutableMapOf())
    val userChoices: LiveData<MutableMap<Int, Int>> get() = _userChoices

    // Timer để quản lý đếm ngược
    private var countDownTimer: CountDownTimer? = null
    private val TIMER_DURATION = 30000L // 30 giây bài thi

    fun setQuestions(allQuestions: List<Question>) {
        _questions.value = allQuestions
        _currentQuestionIndex.value = 0
        _score.value = 0
        _isFinished.value = false
        _userChoices.value = mutableMapOf()
        startNewTimer()
    }

    /**
     * Khởi động bộ đếm ngược 30 giây cho câu hỏi hiện tại
     */
    fun startNewTimer() {
        countDownTimer?.cancel()
        _timeLeft.value = 30
        
        countDownTimer = object : CountDownTimer(TIMER_DURATION, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                _timeLeft.value = (millisUntilFinished / 1000).toInt()
            }

            override fun onFinish() {
                _timeLeft.value = 0
                // Hết giờ coi như tự chọn sai (-1) và nhảy qua câu tiếp theo
                submitAnswer(-1)
            }
        }.start()
    }

    /**
     * Submit câu trả lời của người dùng
     */
    fun submitAnswer(selectedOptionIndex: Int) {
        val currentIndex = _currentQuestionIndex.value ?: 0
        val questionList = _questions.value ?: return
        val currentQuestion = questionList.getOrNull(currentIndex) ?: return

        // Lưu câu trả lời của người dùng
        val currentChoices = _userChoices.value ?: mutableMapOf()
        currentChoices[currentIndex] = selectedOptionIndex
        _userChoices.value = currentChoices

        // Tính điểm nếu người dùng chọn đúng
        if (selectedOptionIndex == currentQuestion.correctIndex) {
            _score.value = (_score.value ?: 0) + 1
        }

        countDownTimer?.cancel()
    }

    /**
     * Chuyển sang câu tiếp theo hoặc kết thúc bài làm
     */
    fun moveToNext() {
        val currentIndex = _currentQuestionIndex.value ?: 0
        val questionList = _questions.value ?: return

        if (currentIndex < questionList.size - 1) {
            _currentQuestionIndex.value = currentIndex + 1
            startNewTimer()
        } else {
            _isFinished.value = true
        }
    }

    override fun onCleared() {
        super.onCleared()
        countDownTimer?.cancel() // Huỷ timer để tránh Memory Leak
    }
}
`
  },
  {
    path: "app/src/main/java/com/kotlin/quiz/MainActivity.kt",
    name: "MainActivity.kt",
    language: "kotlin",
    description: "Trang chủ ứng dụng cho phép lựa chọn chủ đề Quiz, hiển thị Điểm cao nhất lấy từ SharedPreferences.",
    code: `package com.kotlin.quiz

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.app.AppCompatDelegate
import com.kotlin.quiz.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var sharedPreferences: SharedPreferences
    private var selectedTopic = "kotlin-basics"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Khởi tạo View Binding để ánh xạ layout UI an toàn
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sharedPreferences = getSharedPreferences("QuizPrefs", Context.MODE_PRIVATE)
        
        setupThemeToggle()
        displayHighScore()
        setupCategorySelection()

        // Sự kiện click nút Bắt đầu
        binding.btnStartQuiz.setOnClickListener {
            val intent = Intent(this, QuizActivity::class.java).apply {
                putExtra("SELECTED_TOPIC", selectedTopic)
            }
            startActivity(intent)
        }
    }

    override fun onResume() {
        super.onResume()
        // Cập nhật điểm cao nhất khi quay lại màn hình Home
        displayHighScore()
    }

    /**
     * Đọc điểm cao nhất từ SharedPreferences và hiển thị
     */
    private fun displayHighScore() {
        val highScoreBasics = sharedPreferences.getInt("HIGH_SCORE_kotlin-basics", 0)
        val highScoreUI = sharedPreferences.getInt("HIGH_SCORE_android-ui", 0)
        val highScoreMVVM = sharedPreferences.getInt("HIGH_SCORE_kotlin-mvvm", 0)

        binding.tvHighScoreBasics.text = "Cơ bản: \${highScoreBasics}/10 câu (\${highScoreBasics * 10}%)"
        binding.tvHighScoreUI.text = "Giao diện: \${highScoreUI}/10 câu (\${highScoreUI * 10}%)"
        binding.tvHighScoreMVVM.text = "Kiến trúc: \${highScoreMVVM}/10 câu (\${highScoreMVVM * 10}%)"
    }

    /**
     * Quản lý chuyển đổi giao diện Sáng / Tối (Dark/Light Mode)
     */
    private fun setupThemeToggle() {
        val isDarkMode = sharedPreferences.getBoolean("DARK_MODE", false)
        
        if (isDarkMode) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
            binding.switchTheme.isChecked = true
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
            binding.switchTheme.isChecked = false
        }

        binding.switchTheme.setOnCheckedChangeListener { _, isChecked ->
            sharedPreferences.edit().putBoolean("DARK_MODE", isChecked).apply()
            if (isChecked) {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
            } else {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
            }
        }
    }

    /**
     * Bắt sự kiện chọn chủ đề thi
     */
    private fun setupCategorySelection() {
        binding.cardTopicBasics.setOnClickListener {
            selectTopicCard("kotlin-basics")
        }
        binding.cardTopicUI.setOnClickListener {
            selectTopicCard("android-ui")
        }
        binding.cardTopicMVVM.setOnClickListener {
            selectTopicCard("kotlin-mvvm")
        }
        
        // Mặc định chọn Kotlin Basics ban đầu
        selectTopicCard("kotlin-basics")
    }

    private fun selectTopicCard(topicId: String) {
        selectedTopic = topicId
        
        // Cập nhật đường viền border để phản hồi vị trí click cho người dùng
        binding.cardTopicBasics.strokeWidth = if (topicId == "kotlin-basics") 6 else 0
        binding.cardTopicUI.strokeWidth = if (topicId == "android-ui") 6 else 0
        binding.cardTopicMVVM.strokeWidth = if (topicId == "kotlin-mvvm") 6 else 0
    }
}
`
  },
  {
    path: "app/src/main/java/com/kotlin/quiz/QuizActivity.kt",
    name: "QuizActivity.kt",
    language: "kotlin",
    description: "Activity cốt lõi điều hành tiến trình thi Quiz: hiển thị câu hỏi, update ProgressBar, bật countdown, feedback giải thích và hiển thị RecyclerView review ở màn kết quả.",
    code: `package com.kotlin.quiz

import android.content.Context
import android.content.SharedPreferences
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.Button
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.kotlin.quiz.adapter.QuizAdapter
import com.kotlin.quiz.databinding.ActivityQuizBinding
import com.kotlin.quiz.model.Question
import com.kotlin.quiz.viewmodel.QuizViewModel

class QuizActivity : AppCompatActivity() {

    private lateinit var binding: ActivityQuizBinding
    private val viewModel: QuizViewModel by viewModels()
    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var topicId: String
    private var hasAnsweredCurrent = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        binding = ActivityQuizBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sharedPreferences = getSharedPreferences("QuizPrefs", Context.MODE_PRIVATE)
        topicId = intent.getStringExtra("SELECTED_TOPIC") ?: "kotlin-basics"

        setupDatabaseAndStart()
        observeViewModel()
        setupListeners()
    }

    /**
     * Khởi tạo ngân hàng câu hỏi tương ứng và nạp vào ViewModel
     */
    private fun setupDatabaseAndStart() {
        val questions = getQuestionsForTopic(topicId)
        viewModel.setQuestions(questions)
    }

    /**
     * Lắng nghe biến động dữ liệu từ LiveData (MVVM)
     */
    private fun observeViewModel() {
        // 1. Lắng nghe cập nhật câu hỏi hiện tại
        viewModel.currentQuestionIndex.observe(this) { index ->
            displayQuestion(index)
        }

        // 2. Lắng nghe cập nhật thời gian đếm ngược
        viewModel.timeLeft.observe(this) { seconds ->
            binding.tvTimer.text = "\${seconds}s"
            binding.progressTimer.progress = seconds * 100 / 30 // Quy đổi về thang 100%

            // Chuyển màu cảnh báo khi thời gian < 10s
            if (seconds <= 10) {
                binding.tvTimer.setTextColor(Color.RED)
            } else {
                binding.tvTimer.setTextColor(Color.parseColor("#4F46E5"))
            }
        }

        // 3. Lắng nghe trạng thái kết thúc bài thi
        viewModel.isFinished.observe(this) { isFinished ->
            if (isFinished) {
                showQuizResult()
            }
        }
    }

    private fun setupListeners() {
        // Nút bấm Tiếp theo
        binding.btnNext.setOnClickListener {
            hasAnsweredCurrent = false
            binding.layoutFeedback.visibility = View.GONE
            binding.btnNext.visibility = View.INVISIBLE
            viewModel.moveToNext()
        }

        // Action tương tác khi chọn đáp án
        val optionButtons = listOf(binding.btnOption1, binding.btnOption2, binding.btnOption3, binding.btnOption4)
        optionButtons.forEachIndexed { index, button ->
            button.setOnClickListener {
                if (!hasAnsweredCurrent) {
                    handleAnswerSelection(index)
                }
            }
        }

        // Sự kiện màn hình kết quả
        binding.btnRetry.setOnClickListener {
            // Chơi lại chủ đề này
            binding.layoutResult.visibility = View.GONE
            binding.layoutQuiz.visibility = View.VISIBLE
            setupDatabaseAndStart()
        }

        binding.btnHome.setOnClickListener {
            // Quay lại trang Home
            finish()
        }
    }

    /**
     * Hiển thị câu hỏi lên Widget
     */
    private fun displayQuestion(index: Int) {
        val list = viewModel.questions.value ?: return
        val question = list.getOrNull(index) ?: return

        hasAnsweredCurrent = false
        binding.tvQuestionCount.text = "Câu hỏi \${index + 1}/\${list.size}"
        binding.progressBarQuiz.progress = (index + 1) * 100 / list.size
        binding.tvQuestionText.text = question.text

        // Đổ đáp án lên nút bấm
        binding.btnOption1.text = question.options[0]
        binding.btnOption2.text = question.options[1]
        binding.btnOption3.text = question.options[2]
        binding.btnOption4.text = question.options[3]

        // Reset trạng thái style của các nút đáp án về ban đầu
        resetOptionButtons()
    }

    private fun resetOptionButtons() {
        val buttons = listOf(binding.btnOption1, binding.btnOption2, binding.btnOption3, binding.btnOption4)
        buttons.forEach { button ->
            button.setBackgroundColor(Color.parseColor("#F3F4F6")) // Màu xám nhạt mặc định
            button.setTextColor(Color.BLACK)
            button.isEnabled = true
        }
    }

    /**
     * Xử lý click chọn đáp án
     */
    private fun handleAnswerSelection(selectedIndex: Int) {
        hasAnsweredCurrent = true
        val list = viewModel.questions.value ?: return
        val currentQuestion = list[viewModel.currentQuestionIndex.value ?: 0]

        viewModel.submitAnswer(selectedIndex)

        val buttons = listOf(binding.btnOption1, binding.btnOption2, binding.btnOption3, binding.btnOption4)
        buttons.forEach { it.isEnabled = false } // Khóa nút không cho click tiếp

        // Cập nhật màu nút đáp án đúng/sai trực quan
        if (selectedIndex == currentQuestion.correctIndex) {
            buttons[selectedIndex].setBackgroundColor(Color.parseColor("#10B981")) // Xanh lục - Đúng
            buttons[selectedIndex].setTextColor(Color.WHITE)
            binding.tvFeedbackStatus.text = "✓ ĐÚNG RỒI!"
            binding.tvFeedbackStatus.setTextColor(Color.parseColor("#10B981"))
        } else {
            if (selectedIndex != -1) {
                buttons[selectedIndex].setBackgroundColor(Color.parseColor("#EF4444")) // Đỏ - Sai
                buttons[selectedIndex].setTextColor(Color.WHITE)
            }
            // Tô xanh lá đáp án chuẩn để người dùng học
            buttons[currentQuestion.correctIndex].setBackgroundColor(Color.parseColor("#10B981"))
            buttons[currentQuestion.correctIndex].setTextColor(Color.WHITE)
            
            binding.tvFeedbackStatus.text = "✗ CHƯA CHÍNH XÁC!"
            binding.tvFeedbackStatus.setTextColor(Color.parseColor("#EF4444"))
        }

        // Hiển thị feedback giải thích ngắn
        binding.tvFeedbackExplanation.text = currentQuestion.explanation
        binding.layoutFeedback.visibility = View.VISIBLE
        binding.btnNext.visibility = View.VISIBLE
    }

    /**
     * Hiển thị bảng tổng kết điểm bài thi
     */
    private fun showQuizResult() {
        binding.layoutQuiz.visibility = View.GONE
        binding.layoutResult.visibility = View.VISIBLE

        val finalScore = viewModel.score.value ?: 0
        val totalQuestions = viewModel.questions.value?.size ?: 10
        val percentage = (finalScore.toFloat() / totalQuestions * 100).toInt()

        binding.tvResultScore.text = "\${finalScore}/\${totalQuestions}"
        binding.tvResultPercentage.text = "Tỷ lệ chính xác: \${percentage}%"

        // Lưu Điểm cao nhất bằng SharedPreferences
        val currentHighScore = sharedPreferences.getInt("HIGH_SCORE_\${topicId}", 0)
        if (finalScore > currentHighScore) {
            sharedPreferences.edit().putInt("HIGH_SCORE_\${topicId}", finalScore).apply()
            binding.tvHighScoreAlert.visibility = View.VISIBLE
            binding.tvHighScoreAlert.text = "🎉 ĐĂNG KÝ KỶ LỤC MỚI TIÊU BIỂU!"
        } else {
            binding.tvHighScoreAlert.visibility = View.GONE
        }

        // Cấu hình RecyclerView hiển thị danh sách câu hỏi xem lại chi tiết sau khi thi
        binding.rvReviewList.layoutManager = LinearLayoutManager(this)
        val adapter = QuizAdapter(
            questions = viewModel.questions.value ?: emptyList(),
            userChoices = viewModel.userChoices.value ?: emptyMap()
        )
        binding.rvReviewList.adapter = adapter
    }

    /**
     * Helper sinh dữ liệu ngẫu nhiên (Thực tế sẽ kết nối tới Service/DB)
     */
    private fun getQuestionsForTopic(topicId: String): List<Question> {
        // Trong dự án thực tế, danh sách này có thể đọc từ một tệp JSON hoặc SQLite.
        // Dữ liệu câu hỏi đồng bộ chuẩn xác giống hệt hệ thống Mock Simulator.
        return when (topicId) {
            "kotlin-basics" -> getKotlinBasicsQuestions()
            "android-ui" -> getAndroidUIQuestions()
            else -> getMVVMQuestions()
        }
    }

    // Các hàm phụ để khởi dựng tập câu hỏi...
    private fun getKotlinBasicsQuestions(): List<Question> {
        return listOf(
            Question(1, "Trong Kotlin, điểm khác biệt cơ bản giữa việc khai báo biến với 'val' và 'var' là gì?", listOf("var là hằng số không thể thay đổi giá trị, val thì ngược lại", "val khai báo biến chỉ đọc (read-only) không thể gán lại; var khai báo biến có thể thay đổi giá trị", "val dùng cho biến cục bộ, var dùng cho thuộc tính lớp", "val tiêu tốn nhiều bộ nhớ RAM hơn var"), 1, "Từ khóa 'val' định nghĩa biến chỉ đọc (read-only), chỉ được gán giá trị một lần duy nhất. Còn 'var' định nghĩa biến có thể thay đổi."),
            // Thêm đầy đủ 10 câu hỏi tương ứng...
        )
    }
    private fun getAndroidUIQuestions(): List<Question> = emptyList() // Viết đầy đủ tương tự
    private fun getMVVMQuestions(): List<Question> = emptyList() // Viết đầy đủ tương tự
}
`
  },
  {
    path: "app/src/main/java/com/kotlin/quiz/adapter/QuizAdapter.kt",
    name: "QuizAdapter.kt",
    language: "kotlin",
    description: "Adapter của RecyclerView đảm nhiệm tái chế View và hiển thị danh sách toàn bộ câu hỏi kèm lời giải đáp và chỉ thị màu sắc đỏ/xanh chuẩn xác của người làm.",
    code: `package com.kotlin.quiz.adapter

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.kotlin.quiz.databinding.ItemQuizReviewBinding
import com.kotlin.quiz.model.Question

class QuizAdapter(
    private val questions: List<Question>,
    private val userChoices: Map<Int, Int>
) : RecyclerView.Adapter<QuizAdapter.ReviewViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ReviewViewHolder {
        val binding = ItemQuizReviewBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ReviewViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ReviewViewHolder, position: Int) {
        val question = questions[position]
        val userChoice = userChoices[position] ?: -1
        holder.bind(question, position, userChoice)
    }

    override fun getItemCount(): Int = questions.size

    class ReviewViewHolder(private val binding: ItemQuizReviewBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(question: Question, position: Int, userChoice: Int) {
            binding.tvReviewIndex.text = "Câu \${position + 1}:"
            binding.tvReviewQuestionText.text = question.text

            // Hiển thị 4 phương án câu trả lời
            binding.tvReviewOpt1.text = "A. \${question.options[0]}"
            binding.tvReviewOpt2.text = "B. \${question.options[1]}"
            binding.tvReviewOpt3.text = "C. \${question.options[2]}"
            binding.tvReviewOpt4.text = "D. \${question.options[3]}"

            // Reset màu sắc văn bản mặc định
            val optionTexts = listOf(binding.tvReviewOpt1, binding.tvReviewOpt2, binding.tvReviewOpt3, binding.tvReviewOpt4)
            optionTexts.forEach { it.setTextColor(Color.parseColor("#374151")) }

            // Đánh dấu icon Đúng / Sai
            if (userChoice == question.correctIndex) {
                binding.imgReviewStatus.text = "✓"
                binding.imgReviewStatus.setTextColor(Color.parseColor("#10B981")) // Màu xanh lá
                binding.layoutReviewCard.setBackgroundColor(Color.parseColor("#F0FDF4")) // Nền xanh nhạt
                optionTexts[userChoice].setTextColor(Color.parseColor("#10B981"))
                optionTexts[userChoice].text = optionTexts[userChoice].text.toString() + " (Bạn chọn đúng)"
            } else {
                binding.imgReviewStatus.text = "✗"
                binding.imgReviewStatus.setTextColor(Color.parseColor("#EF4444")) // Màu đỏ cảnh báo
                binding.layoutReviewCard.setBackgroundColor(Color.parseColor("#FEF2F2")) // Nền đỏ nhạt

                if (userChoice != -1) {
                    optionTexts[userChoice].setTextColor(Color.parseColor("#EF4444"))
                    optionTexts[userChoice].text = optionTexts[userChoice].text.toString() + " (Bạn chọn sai)"
                }
                
                // Luôn tô màu xanh cho đáp án đúng của hệ thống
                optionTexts[question.correctIndex].setTextColor(Color.parseColor("#10B981"))
                optionTexts[question.correctIndex].text = optionTexts[question.correctIndex].text.toString() + " (Đáp án đúng)"
            }

            // Hiển thị lời giải thích chi tiết có sẵn
            binding.tvReviewExplanation.text = "Giải thích: \${question.explanation}"
        }
    }
}
`
  },
  {
    path: "app/src/main/res/layout/activity_main.xml",
    name: "activity_main.xml",
    language: "xml",
    description: "Tệp tin thiết kế bố cục ConstraintLayout trang chủ có switch bật theme và các ô Topic tuyển lựa đặc thù cực đẹp.",
    code: `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="20dp"
    android:background="?android:attr/windowBackground">

    <!-- Header: Tiêu đề và Nút chuyển đổi Theme -->
    <TextView
        android:id="@+id/tvAppTitle"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:text="Quiz Lập Trình Kotlin"
        android:textSize="26sp"
        android:textStyle="bold"
        android:textColor="@color/black"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toStartOf="@+id/switchTheme"
        app:layout_constraintTop_toTopOf="parent"
        android:layout_marginTop="20dp"/>

    <com.google.android.material.materialswitch.MaterialSwitch
        android:id="@+id/switchTheme"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toTopOf="@+id/tvAppTitle"
        app:layout_constraintBottom_toBottomOf="@+id/tvAppTitle" />

    <!-- Subtitle -->
    <TextView
        android:id="@+id/tvSubtitle"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Làm quen với các cấu trúc lý thuyết Android và rèn luyện kỹ năng cho dự án."
        android:textSize="14sp"
        android:textColor="@color/gray"
        app:layout_constraintTop_toBottomOf="@id/tvAppTitle"
        android:layout_marginTop="8dp"/>

    <!-- High Scores List -->
    <com.google.android.material.card.MaterialCardView
        android:id="@+id/cardHighScore"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:cardCornerRadius="16dp"
        app:strokeColor="#E5E7EB"
        app:strokeWidth="1dp"
        android:layout_marginTop="24dp"
        app:layout_constraintTop_toBottomOf="@id/tvSubtitle">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="16dp">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="🏆 Xem điểm cao nhất"
                android:textStyle="bold"
                android:textSize="16sp"
                android:textColor="#F59E0B"
                android:layout_marginBottom="12dp"/>

            <TextView
                android:id="@+id/tvHighScoreBasics"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="Cơ bản: 0/10 câu (0%)"
                android:layout_marginBottom="6dp" />

            <TextView
                android:id="@+id/tvHighScoreUI"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="Giao diện: 0/10 câu (0%)"
                android:layout_marginBottom="6dp" />

            <TextView
                android:id="@+id/tvHighScoreMVVM"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="Kiến trúc: 0/10 câu (0%)" />
        </LinearLayout>
    </com.google.android.material.card.MaterialCardView>

    <!-- Topic Title -->
    <TextView
        android:id="@+id/tvSelectTopic"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Chọn chủ đề Quiz"
        android:textStyle="bold"
        android:textSize="18sp"
        android:layout_marginTop="24dp"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@id/cardHighScore"/>

    <!-- Topic Card 1 (Basics) -->
    <com.google.android.material.card.MaterialCardView
        android:id="@+id/cardTopicBasics"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="12dp"
        app:cardCornerRadius="12dp"
        app:strokeColor="#4F46E5"
        app:strokeWidth="0dp"
        app:layout_constraintTop_toBottomOf="@id/tvSelectTopic">
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="14dp">
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Kotlin Basics"
                android:textColor="#4F46E5"
                android:textStyle="bold"
                android:textSize="16sp"/>
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Biến, Null Safety, functions, data class..."
                android:textSize="12sp"
                android:textColor="#4B5563"/>
        </LinearLayout>
    </com.google.android.material.card.MaterialCardView>

    <!-- Topic Card 2 (UI) -->
    <com.google.android.material.card.MaterialCardView
        android:id="@+id/cardTopicUI"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="10dp"
        app:cardCornerRadius="12dp"
        app:strokeColor="#4F46E5"
        app:strokeWidth="0dp"
        app:layout_constraintTop_toBottomOf="@id/cardTopicBasics">
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="14dp">
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Android UI &amp; Components"
                android:textColor="#06B6D4"
                android:textStyle="bold"
                android:textSize="16sp"/>
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Activity, Challenge Lifecycle, Layout XML, Adapter..."
                android:textSize="12sp"
                android:textColor="#4B5563"/>
        </LinearLayout>
    </com.google.android.material.card.MaterialCardView>

    <!-- Topic Card 3 (MVVM) -->
    <com.google.android.material.card.MaterialCardView
        android:id="@+id/cardTopicMVVM"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="10dp"
        app:cardCornerRadius="12dp"
        app:strokeColor="#4F46E5"
        app:strokeWidth="0dp"
        app:layout_constraintTop_toBottomOf="@id/cardTopicUI">
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="14dp">
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="MVVM &amp; Architecture"
                android:textColor="#10B981"
                android:textStyle="bold"
                android:textSize="16sp"/>
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Model-View-ViewModel, LiveData, Clean Architecture..."
                android:textSize="12sp"
                android:textColor="#4B5563"/>
        </LinearLayout>
    </com.google.android.material.card.MaterialCardView>

    <!-- Nút Bắt Đầu -->
    <com.google.android.material.button.MaterialButton
        android:id="@+id/btnStartQuiz"
        android:layout_width="match_parent"
        android:layout_height="56dp"
        android:text="BẮT ĐẦU TRẢI NGHIỆM"
        android:textSize="16sp"
        android:textStyle="bold"
        app:cornerRadius="16dp"
        android:backgroundTint="#4F46E5"
        android:textColor="@color/white"
        android:layout_marginBottom="10dp"
        app:layout_constraintBottom_toBottomOf="parent"/>

</androidx.constraintlayout.widget.ConstraintLayout>
`
  },
  {
    path: "app/src/main/res/layout/activity_quiz.xml",
    name: "activity_quiz.xml",
    language: "xml",
    description: "ConstraintLayout của màn làm bài chính: hiển thị tiến độ thanh ProgressBar, bộ đếm tròn đếm ngược, câu hỏi, 4 nút dạng Card và thanh báo feedback đáp án trực diện.",
    code: `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="?android:attr/windowBackground">

    <!-- 1. GIAO DIỆN LÀM BÀI QUIZ (layout_quiz) -->
    <ScrollView
        android:id="@+id/layout_quiz"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:fillViewport="true">
        
        <androidx.constraintlayout.widget.ConstraintLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:padding="20dp">

            <!-- Progress Bar -->
            <TextView
                android:id="@+id/tvQuestionCount"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Câu hỏi 1/10"
                android:textStyle="bold"
                android:textSize="14sp"
                app:layout_constraintTop_toTopOf="parent"
                app:layout_constraintStart_toStartOf="parent" />

            <ProgressBar
                android:id="@+id/progressBarQuiz"
                style="?android:attr/progressBarStyleHorizontal"
                android:layout_width="0dp"
                android:layout_height="12dp"
                android:progressDrawable="@drawable/custom_progress"
                app:layout_constraintTop_toTopOf="@id/tvQuestionCount"
                app:layout_constraintBottom_toBottomOf="@id/tvQuestionCount"
                app:layout_constraintStart_toEndOf="@id/tvQuestionCount"
                app:layout_constraintEnd_toEndOf="parent"
                android:layout_marginLeft="16dp"/>

            <!-- Timer Đếm Ngược Hình Tròn -->
            <com.google.android.material.progressindicator.CircularProgressIndicator
                android:id="@+id/progressTimer"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="20dp"
                app:trackColor="#E5E7EB"
                app:indicatorColor="#4F46E5"
                app:indicatorSize="64dp"
                app:trackThickness="6dp"
                app:layout_constraintTop_toBottomOf="@id/tvQuestionCount"
                app:layout_constraintStart_toStartOf="parent"
                app:layout_constraintEnd_toEndOf="parent" />

            <TextView
                android:id="@+id/tvTimer"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="30s"
                android:textStyle="bold"
                android:textSize="16sp"
                app:layout_constraintTop_toTopOf="@id/progressTimer"
                app:layout_constraintBottom_toBottomOf="@id/progressTimer"
                app:layout_constraintStart_toStartOf="@id/progressTimer"
                app:layout_constraintEnd_toEndOf="@id/progressTimer" />

            <!-- Question Card -->
            <com.google.android.material.card.MaterialCardView
                android:id="@+id/cardQuestion"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="20dp"
                app:cardCornerRadius="16dp"
                app:cardElevation="2dp"
                app:layout_constraintTop_toBottomOf="@id/progressTimer">
                
                <TextView
                    android:id="@+id/tvQuestionText"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:padding="20dp"
                    android:text="Nội dung câu hỏi hiển thị tại đây?"
                    android:textSize="18sp"
                    android:textColor="#111827"
                    android:textStyle="medium" />
            </com.google.android.material.card.MaterialCardView>

            <!-- Lựa Chọn Hán Tự (Options list) -->
            <LinearLayout
                android:id="@+id/layout_options"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:layout_marginTop="20dp"
                app:layout_constraintTop_toBottomOf="@id/cardQuestion">

                <com.google.android.material.button.MaterialButton
                    android:id="@+id/btnOption1"
                    style="@style/Widget.Material3.Button.ElevatedButton"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="Sự chọn lựa A"
                    android:layout_marginBottom="8dp"
                    android:textColor="#374151"
                    android:padding="16dp" />

                <com.google.android.material.button.MaterialButton
                    android:id="@+id/btnOption2"
                    style="@style/Widget.Material3.Button.ElevatedButton"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="Sự chọn lựa B"
                    android:layout_marginBottom="8dp"
                    android:textColor="#374151"
                    android:padding="16dp" />

                <com.google.android.material.button.MaterialButton
                    android:id="@+id/btnOption3"
                    style="@style/Widget.Material3.Button.ElevatedButton"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="Sự chọn lựa C"
                    android:layout_marginBottom="8dp"
                    android:textColor="#374151"
                    android:padding="16dp" />

                <com.google.android.material.button.MaterialButton
                    android:id="@+id/btnOption4"
                    style="@style/Widget.Material3.Button.ElevatedButton"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="Sự chọn lựa D"
                    android:layout_marginBottom="8dp"
                    android:textColor="#374151"
                    android:padding="16dp" />
            </LinearLayout>

            <!-- Feedback Panel (Hiển thị ngay sau khi lựa chọn) -->
            <LinearLayout
                android:id="@+id/layoutFeedback"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="14dp"
                android:background="#F3F4F6"
                android:layout_marginTop="16dp"
                android:visibility="gone"
                app:layout_constraintTop_toBottomOf="@id/layout_options">

                <TextView
                    android:id="@+id/tvFeedbackStatus"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="✓ ĐÚNG RỒI!"
                    android:textStyle="bold"
                    android:textSize="16sp" />

                <TextView
                    android:id="@+id/tvFeedbackExplanation"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="Lời thuyết minh cho việc chọn đúng hoặc sai sẽ được hiển thị ở đây."
                    android:textSize="13sp"
                    android:textColor="#4B5563"
                    android:layout_marginTop="4dp" />
            </LinearLayout>

            <!-- Nút Next -->
            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnNext"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="KẾ TIẾP"
                android:visibility="invisible"
                app:layout_constraintEnd_toEndOf="parent"
                app:layout_constraintTop_toBottomOf="@id/layoutFeedback"
                android:layout_marginTop="16dp"
                android:backgroundTint="#4F46E5" />

        </androidx.constraintlayout.widget.ConstraintLayout>
    </ScrollView>

    <!-- 2. GIAO DIỆN KẾT QUẢ ĐIỂM SỐ & REVIEW RECYCLERVIEW (layout_result) -->
    <LinearLayout
        android:id="@+id/layout_result"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical"
        android:padding="20dp"
        android:visibility="gone"
        android:background="?android:attr/windowBackground">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Kết quả bài làm"
            android:textSize="24sp"
            android:textStyle="bold"
            android:layout_gravity="center_horizontal"
            android:layout_marginTop="20dp" />

        <!-- Điểm vòng -->
        <TextView
            android:id="@+id/tvResultScore"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="8/10"
            android:textSize="48sp"
            android:textStyle="bold"
            android:textColor="#4F46E5"
            android:layout_gravity="center_horizontal"
            android:layout_marginTop="16dp" />

        <TextView
            android:id="@+id/tvResultPercentage"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Tỷ lệ chính xác: 80%"
            android:textSize="16sp"
            android:layout_gravity="center_horizontal" />

        <TextView
            android:id="@+id/tvHighScoreAlert"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="🎉 KỶ LỤC ĐIỂM MỚI!"
            android:textColor="#F59E0B"
            android:textStyle="bold"
            android:visibility="gone"
            android:layout_gravity="center_horizontal"
            android:layout_marginTop="6dp"/>

        <!-- Review Danh sách -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Xem lại chi tiết bằng RecyclerView"
            android:textStyle="bold"
            android:textSize="16sp"
            android:layout_marginTop="20dp"
            android:layout_marginBottom="8dp" />

        <androidx.recyclerview.widget.RecyclerView
            android:id="@+id/rvReviewList"
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1" />

        <!-- Control Buttons -->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            android:layout_marginTop="16dp"
            android:gap="12dp">

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnRetry"
                style="@style/Widget.Material3.Button.OutlinedButton"
                android:layout_width="0dp"
                android:layout_height="50dp"
                android:layout_weight="1"
                android:text="LÀM LẠI"
                app:strokeColor="#4F46E5"
                android:textColor="#4F46E5" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnHome"
                android:layout_width="0dp"
                android:layout_height="50dp"
                android:layout_weight="1"
                android:text="TRANG CHỦ"
                android:backgroundTint="#4F46E5" />
        </LinearLayout>
    </LinearLayout>

</androidx.constraintlayout.widget.ConstraintLayout>
`
  },
  {
    path: "app/src/main/res/layout/item_quiz_review.xml",
    name: "item_quiz_review.xml",
    language: "xml",
    description: "Layout XML đại diện cho một hàng (Item Card) dùng trong adapter chứa câu hỏi, 4 phương án câu trả lời và lời giải thích khoa học.",
    code: `<?xml version="1.0" encoding="utf-8"?>
<com.google.android.material.card.MaterialCardView
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/layoutReviewCard"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginBottom="12dp"
    app:cardCornerRadius="12dp"
    app:strokeWidth="1dp"
    app:strokeColor="#E5E7EB">

    <androidx.constraintlayout.widget.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:padding="14dp">

        <TextView
            android:id="@+id/tvReviewIndex"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Câu 1:"
            android:textStyle="bold"
            android:textColor="#4F46E5"
            app:layout_constraintTop_toTopOf="parent"
            app:layout_constraintStart_toStartOf="parent"/>

        <TextView
            android:id="@+id/imgReviewStatus"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="✓"
            android:textSize="20sp"
            android:textStyle="bold"
            app:layout_constraintTop_toTopOf="parent"
            app:layout_constraintEnd_toEndOf="parent" />

        <TextView
            android:id="@+id/tvReviewQuestionText"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:text="Nội dung câu hỏi review sẽ hiển thị tại đây?"
            android:textStyle="medium"
            android:textColor="#1F2937"
            android:layout_marginTop="6dp"
            app:layout_constraintTop_toBottomOf="@id/tvReviewIndex"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintEnd_toEndOf="parent"/>

        <!-- Four Options display -->
        <LinearLayout
            android:id="@+id/layoutReviewOptions"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:layout_marginTop="8dp"
            app:layout_constraintTop_toBottomOf="@id/tvReviewQuestionText">

            <TextView
                android:id="@+id/tvReviewOpt1"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="A. Option value 1"
                android:layout_marginBottom="4dp"
                android:textSize="13sp"/>

            <TextView
                android:id="@+id/tvReviewOpt2"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="B. Option value 2"
                android:layout_marginBottom="4dp"
                android:textSize="13sp"/>

            <TextView
                android:id="@+id/tvReviewOpt3"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="C. Option value 3"
                android:layout_marginBottom="4dp"
                android:textSize="13sp"/>

            <TextView
                android:id="@+id/tvReviewOpt4"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="D. Option value 4"
                android:layout_marginBottom="8dp"
                android:textSize="13sp"/>
        </LinearLayout>

        <!-- Divider line -->
        <View
            android:id="@+id/reviewDivider"
            android:layout_width="match_parent"
            android:layout_height="1dp"
            android:background="#E5E7EB"
            app:layout_constraintTop_toBottomOf="@id/layoutReviewOptions"
            android:layout_marginTop="4dp"/>

        <!-- Explanation text -->
        <TextView
            android:id="@+id/tvReviewExplanation"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Bởi vì từ khoá val dùng để khai báo biến tĩnh chỉ đọc..."
            android:textSize="12sp"
            android:textColor="#6B7280"
            android:textStyle="italic"
            android:layout_marginTop="8dp"
            app:layout_constraintTop_toBottomOf="@id/reviewDivider"/>

    </androidx.constraintlayout.widget.ConstraintLayout>
</com.google.android.material.card.MaterialCardView>
`
  },
  {
    path: "app/src/main/AndroidManifest.xml",
    name: "AndroidManifest.xml",
    language: "xml",
    description: "Manifest XML cấu hình các Activity, thuộc tính theme, và quy chuẩn Activity Launcher mặc định.",
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.kotlin.quiz">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.KotlinQuiz">
        
        <!-- Launcher Activity: Màn hình chính -->
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Quiz Play Activity -->
        <activity
            android:name=".QuizActivity"
            android:exported="false" />
            
    </application>

</manifest>
`
  },
  {
    path: "app/build.gradle",
    name: "build.gradle (Module:app)",
    language: "gradle",
    description: "Cấu hình Gradle dependencies bao gồm View Binding, Lifecyle ViewModel, RecyclerView và Material Components.",
    code: `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    namespace 'com.kotlin.quiz'
    compileSdk 34

    defaultConfig {
        applicationId "com.kotlin.quiz"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
    
    kotlinOptions {
        jvmTarget = '17'
    }

    // Kích hoạt View Binding
    viewBinding {
        enabled = true
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    
    // RecyclerView list components
    implementation 'androidx.recyclerview:recyclerview:1.3.2'

    // Jetpack ViewModel and LiveData (MVVM components)
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0'
    implementation 'androidx.lifecycle:lifecycle-livedata-ktx:2.7.0'
    implementation 'androidx.activity:activity-ktx:1.8.2'
    
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
}
`
  }
];
